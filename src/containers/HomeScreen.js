import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../components/common/CSafeAreaView';
import {colors, styles} from '../themes';
import {Dumbbell, Location, Search} from '../assets/svg';
import {
  CLASSES_LIKES,
  deviceWidth,
  getHeight,
  GYM_LIKES,
  moderateScale,
  POPULAR_CLASSES_LIKES,
} from '../common/constants';
import CText from '../components/common/CText';
import strings from '../i18n/strings';
import {gymData, popularClassesData} from '../api/constants';
import images from '../assets/images';
import {getAsyncStorageData, setAsyncStorageData} from '../utils/helpers';

export default function HomeScreen() {
  const [rGymData, setRGymData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedGym, setSelectedGym] = useState(1);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    const getGymLike = await getAsyncStorageData(GYM_LIKES);
    const getPClassLike = await getAsyncStorageData(POPULAR_CLASSES_LIKES);
    const getClassLikes = await getAsyncStorageData(CLASSES_LIKES);

    let likedGymIDs = getGymLike ? getGymLike : [];
    let likedClassIDs = getClassLikes ? JSON.parse(getClassLikes) : [];
    const likedPClassIDs = getPClassLike ? getPClassLike : [];

    const updatedGymData = gymData.map(gym => {
      if (likedGymIDs.includes(gym.id)) {
        gym.favorite = true;
      } else {
        gym.favorite = false;
      }

      const updatedClasses = gym.popular_clasess.map(cls => {
        const likedClass = likedClassIDs.find(
          likedItem => likedItem.id === cls.id && likedItem.gymId === gym.id,
        );
        if (likedClass) {
          cls.favorite = true;
        } else {
          cls.favorite = false;
        }
        return cls;
      });

      return {...gym, popular_clasess: updatedClasses};
    });

    setRGymData(updatedGymData);
    setSelectedClass(likedPClassIDs);
    setClassData(updatedGymData[0].popular_clasess);
  };

  const onPressGym = itm => {
    setSelectedGym(itm.id);
    setClassData(itm.popular_clasess);
  };

  const onPressGymLikes = async item => {
    const updatedData = rGymData.map(data => {
      if (data.id === item.id) {
        return {...data, favorite: !data.favorite};
      }
      return data;
    });

    const getGymLike = await getAsyncStorageData(GYM_LIKES);
    let likedIDs = getGymLike ? getGymLike : [];

    const currentIndex = likedIDs.indexOf(item.id);
    if (currentIndex !== -1) {
      likedIDs.splice(currentIndex, 1);
    } else {
      likedIDs.push(item.id);
    }
    await setAsyncStorageData(GYM_LIKES, likedIDs);
    setRGymData(updatedData);
  };

  const onPressClass = async itm => {
    if (selectedClass.includes(itm.id)) {
      const updatedData = selectedClass.filter(id => id !== itm.id);
      setSelectedClass(updatedData);
      await setAsyncStorageData(POPULAR_CLASSES_LIKES, updatedData);
    } else {
      const updatedData = [...selectedClass, itm.id];
      setSelectedClass(updatedData);
      await setAsyncStorageData(POPULAR_CLASSES_LIKES, updatedData);
    }
  };

  const onPressClassLike = async item => {
    const updatedData = classData.map(data => {
      if (data.id === item.id) {
        return {...data, favorite: !data.favorite};
      }
      return data;
    });

    const getGymLike = await getAsyncStorageData(CLASSES_LIKES);
    let likedData = getGymLike ? JSON.parse(getGymLike) : [];

    const currentIndex = likedData.findIndex(
      likedItem => likedItem.id === item.id && likedItem.gymId === selectedGym,
    );
    if (currentIndex !== -1) {
      likedData.splice(currentIndex, 1);
    } else {
      likedData.push({id: item.id, gymId: selectedGym});
    }
    await setAsyncStorageData(CLASSES_LIKES, JSON.stringify(likedData));

    setClassData(updatedData);
  };

  const renderGym = ({item}) => (
    <View style={localStyles.renderGymContainer}>
      <Image source={images.map} style={localStyles.mapStyle} />
      <TouchableOpacity
        onPress={() => onPressGym(item)}
        style={localStyles.gymInfoContainer}>
        <Image source={item.image} style={localStyles.gymStyle} />
        <TouchableOpacity
          onPress={() => onPressGymLikes(item)}
          style={localStyles.recommendedLikeStyle}>
          <Ionicons
            name={item.favorite ? 'heart' : 'heart-outline'}
            size={moderateScale(24)}
            color={colors.white}
          />
        </TouchableOpacity>
        <View style={localStyles.detailContainer}>
          <View style={localStyles.rowCenter}>
            <CText type="B18" color={colors.black}>
              {item.title}
            </CText>
            <View>
              <CText type="B14" align={'right'} color={colors.primary}>
                {item.price}
              </CText>
              <CText type="S12" align={'right'} color={colors.grayScale4}>
                {'/day'}
              </CText>
            </View>
          </View>
          <View style={localStyles.dateContainer}>
            <View style={styles.rowStart}>
              <Ionicons
                name="star"
                size={moderateScale(18)}
                color={colors.yellow}
                style={styles.mr5}
              />
              <CText type="S14" style={styles.p14} color={colors.grayScale7}>
                {item.rating}
              </CText>
            </View>
            <CText type="M14" style={styles.p14} color={colors.grayScale5}>
              {strings.from} {item.date}
            </CText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPopularClass = ({item}) => (
    <TouchableOpacity
      onPress={() => onPressClass(item)}
      style={{
        ...localStyles.renderClassContainer,
        backgroundColor: selectedClass.includes(item.id)
          ? colors.primary
          : colors.white,
      }}>
      <Image
        source={item.image}
        style={{
          ...localStyles.popularImgStyle,
          tintColor: !selectedClass.includes(item.id)
            ? colors.primary
            : colors.white,
        }}
      />
    </TouchableOpacity>
  );

  const RenderDescComponent = ({icon, desc}) => {
    return (
      <View style={localStyles.renderDescContainer}>
        <Ionicons name={icon} size={moderateScale(16)} color={colors.primary} />
        <CText
          type="S14"
          numberOfLines={1}
          style={styles.flex}
          color={colors.grayScale7}>
          {desc}
          {desc}
        </CText>
      </View>
    );
  };

  const renderClassItem = ({item}) => {
    return (
      <View style={localStyles.renderClassStyle}>
        <View style={localStyles.renderImgContainer}>
          <TouchableOpacity
            onPress={() => onPressClassLike(item)}
            style={localStyles.classHeartStyle}>
            <Ionicons
              name={item.favorite ? 'heart' : 'heart-outline'}
              size={moderateScale(24)}
              color={colors.white}
            />
          </TouchableOpacity>
          <Image source={item.image} style={localStyles.classImgSTyle} />
        </View>
        <View style={localStyles.descContainer}>
          <View style={localStyles.titleContainer}>
            <CText
              type="B18"
              numberOfLines={2}
              style={styles.flex}
              color={colors.black}>
              {item.title}
            </CText>
            <View style={styles.ml10}>
              <CText type="B14" align={'right'} color={colors.primary}>
                {item.price}
              </CText>
              <CText type="S12" align={'right'} color={colors.grayScale4}>
                {'/day'}
              </CText>
            </View>
          </View>
          <CText type={'S16'} color={colors.grayScale7}>
            {'Gym "Seven"'}
          </CText>
          <RenderDescComponent icon={'location'} desc={item.location} />
          <RenderDescComponent icon={'time'} desc={item.time} />
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <View style={localStyles.headerContainer}>
        <Dumbbell height={moderateScale(24)} width={moderateScale(24)} />
        <View style={localStyles.rightHeaderStyle}>
          <TouchableOpacity>
            <Location height={moderateScale(24)} width={moderateScale(24)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Search height={moderateScale(24)} width={moderateScale(24)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{uri: 'https://picsum.photos/200/300'}}
              style={localStyles.userImgStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CText type="B24" style={styles.p20} color={colors.black}>
          {strings.recommendedGyms}
        </CText>
        <FlatList
          data={rGymData}
          renderItem={renderGym}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={deviceWidth / 1.6 + moderateScale(15)}
          decelerationRate="fast"
          contentContainerStyle={styles.ph20}
        />
        {!!classData.length && (
          <View>
            <CText type="B24" style={styles.p20} color={colors.black}>
              {strings.popularClasses}
            </CText>
            <FlatList
              data={popularClassesData}
              renderItem={renderPopularClass}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              snapToInterval={moderateScale(85)}
              decelerationRate="fast"
              contentContainerStyle={styles.ph20}
            />
            <FlatList
              data={classData}
              renderItem={renderClassItem}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.p20}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.p15,
    ...styles.rowSpaceBetween,
    backgroundColor: colors.primary,
  },
  rightHeaderStyle: {
    ...styles.rowCenter,
    gap: moderateScale(20),
  },
  userImgStyle: {
    borderRadius: moderateScale(12),
    width: moderateScale(24),
    height: moderateScale(24),
  },
  renderGymContainer: {
    width: deviceWidth / 1.6,
    ...styles.mr15,
  },
  mapStyle: {
    width: '100%',
    height: getHeight(70),
    borderRadius: moderateScale(8),
    resizeMode: 'cover',
  },
  gymStyle: {
    width: '100%',
    height: getHeight(150),
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
    backgroundColor: colors.white,
    resizeMode: 'cover',
  },
  gymInfoContainer: {
    top: moderateScale(-10),
    borderRadius: moderateScale(12),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  rowCenter: {
    ...styles.flexRow,
    ...styles.justifyBetween,
  },
  detailContainer: {
    ...styles.ph10,
    ...styles.pv10,
    ...styles.flex,
  },
  recommendedLikeStyle: {
    position: 'absolute',
    top: moderateScale(5),
    right: moderateScale(5),
  },
  dateContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
  },
  renderClassContainer: {
    width: moderateScale(75),
    height: moderateScale(75),
    borderRadius: moderateScale(75 / 2),
    backgroundColor: colors.white,
    ...styles.center,
    ...styles.mr10,
  },
  popularImgStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain',
  },
  classImgSTyle: {
    width: '100%',
    borderTopLeftRadius: moderateScale(12),
    borderBottomLeftRadius: moderateScale(12),
    height: getHeight(160),
    resizeMode: 'contain',
  },
  renderClassStyle: {
    width: '100%',
    ...styles.flexRow,
    borderRadius: moderateScale(10),
    backgroundColor: colors.white,
    marginBottom: moderateScale(20),
  },
  classHeartStyle: {
    position: 'absolute',
    top: moderateScale(5),
    right: moderateScale(10),
    zIndex: 99,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  renderImgContainer: {
    width: '44%',
  },
  descContainer: {
    ...styles.flex,
    ...styles.p10,
    ...styles.justifyBetween,
  },
  titleContainer: {
    ...styles.flexRow,
    ...styles.justifyBetween,
  },
  renderDescContainer: {
    ...styles.rowStart,
    gap: moderateScale(5),
  },
});
